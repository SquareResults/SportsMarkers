export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center sm:text-4xl">How it works?</h2>
        <div className="relative mt-12">
          <div className="absolute w-full h-0.5 bg-gray-200 top-1/2 -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            <div className="w-1/5">
              <div className="relative">
                <div className="w-8 h-8 mx-auto bg-blue-500 rounded-full text-lg text-white flex items-center justify-center">1</div>
              </div>
              <div className="text-center mt-2">Fill the form</div>
            </div>
            <div className="w-1/5">
              <div className="relative">
                <div className="w-8 h-8 mx-auto bg-blue-500 rounded-full text-lg text-white flex items-center justify-center">2</div>
              </div>
              <div className="text-center mt-2">Payment</div>
            </div>
            <div className="w-1/5">
              <div className="relative">
                <div className="w-8 h-8 mx-auto bg-blue-500 rounded-full text-lg text-white flex items-center justify-center">3</div>
              </div>
              <div className="text-center mt-2">Team review</div>
            </div>
            <div className="w-1/5">
              <div className="relative">
                <div className="w-8 h-8 mx-auto bg-blue-500 rounded-full text-lg text-white flex items-center justify-center">4</div>
              </div>
              <div className="text-center mt-2">Feedback</div>
            </div>
            <div className="w-1/5">
              <div className="relative">
                <div className="w-8 h-8 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center justify-center">5</div>
              </div>
              <div className="text-center mt-2">Create the portfolio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
