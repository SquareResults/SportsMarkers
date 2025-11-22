import { NextRequest, NextResponse } from "next/server";
import s3Client from "@/lib/s3Client";
import {
    ListObjectsV2Command,
    DeleteObjectsCommand,
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    DeleteObjectsCommandInput,
} from "@aws-sdk/client-s3";
import { createServerClient } from "@supabase/ssr";

export async function DELETE(req: NextRequest) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bucketName = process.env.S3_BUCKET_NAME!;
    const prefix = `${user.id}/`;

    try {
        // 1. List all objects in the user's folder
        let isTruncated = true;
        let continuationToken: string | undefined = undefined;

        while (isTruncated) {
            const listCommand: ListObjectsV2CommandInput = {
                Bucket: bucketName,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            };

            const listResponse: ListObjectsV2CommandOutput = await s3Client.send(
                new ListObjectsV2Command(listCommand),
            );

            if (listResponse.Contents && listResponse.Contents.length > 0) {
                // 2. Delete objects
                const deleteCommand: DeleteObjectsCommandInput = {
                    Bucket: bucketName,
                    Delete: {
                        Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key })),
                        Quiet: true,
                    },
                };

                await s3Client.send(new DeleteObjectsCommand(deleteCommand));
            }

            isTruncated = listResponse.IsTruncated || false;
            continuationToken = listResponse.NextContinuationToken;
        }

        // 3. Delete portfolio from Supabase
        const { error } = await supabase
            .from("portfolios")
            .delete()
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting portfolio from Supabase:", error);
            return NextResponse.json(
                { error: "Error deleting portfolio data" },
                { status: 500 },
            );
        }

        return NextResponse.json({ message: "Portfolio deleted successfully" });
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        return NextResponse.json(
            { error: "Error deleting portfolio" },
            { status: 500 },
        );
    }
}
