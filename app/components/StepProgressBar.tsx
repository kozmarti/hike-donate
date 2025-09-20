
const StepProgressBar = ({ progress }: { progress: number }) =>{
  return(
  <div className="mb-4">
    <div className="h-3 progress-bar-uncompleted rounded-xl">
      <div
        className="h-3 progress-bar-completed rounded-xl"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-sm mt-1">{progress*4/100} / 4 complete</p>
  </div>
)};

export default StepProgressBar;