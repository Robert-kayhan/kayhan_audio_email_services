const ProgressBar = ({ currentStep, steps }: any) => (
  <div className="w-full max-w-4xl mb-10">
    <div className="flex justify-between mb-2 text-sm">
      {steps.map((step: any, index: number) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className={`flex flex-col items-center transition-all ${index <= currentStep ? "text-green-400" : "text-gray-500"}`}
          >
            <Icon size={22} className="mb-1" />
            <span>{step.title}</span>
          </div>
        );
      })}
    </div>
    <div className="h-2 bg-gray-700 rounded-full">
      <div
        className="h-2 bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
    </div>
  </div>
);
export default ProgressBar;