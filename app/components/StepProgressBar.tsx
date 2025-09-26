import Skeleton from "@mui/material/Skeleton";

interface Props {
  progress: number
  loading: boolean
}

const StepProgressBar = ({ progress, loading }: Props) =>{
  return(
  <div className="mb-4">
    <div className="h-3 progress-bar-uncompleted rounded-xl">
      <div
        className="h-3 progress-bar-completed rounded-xl"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-sm mt-1">{loading? <Skeleton width={20} height={20} style={{ display: "inline-block" }}/> : progress*4/100} / 4 complete</p>
  </div>
)};

export default StepProgressBar;