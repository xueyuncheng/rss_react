type PaginationProps = {
  prevDisabled: boolean;
  onPrevClick: () => void;
  nextDisabled: boolean;
  onNextClick: () => void;
};

export default function Pagination({
  prevDisabled,
  onPrevClick,
  nextDisabled,
  onNextClick,
}: PaginationProps) {
  return (
    <div className="join">
      <button
        className="join-item btn btn-sm"
        disabled={prevDisabled}
        onClick={onPrevClick}
      >
        上一页
      </button>
      <button
        className="join-item btn btn-sm"
        disabled={nextDisabled}
        onClick={onNextClick}
      >
        下一页
      </button>
    </div>
  );
}
