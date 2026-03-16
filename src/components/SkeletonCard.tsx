const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[170px] lg:w-[185px] animate-pulse">
    <div className="aspect-[2/3] rounded border border-border bg-muted" />
    <div className="mt-2 px-0.5 space-y-1.5">
      <div className="h-3.5 w-3/4 rounded bg-muted" />
      <div className="h-2.5 w-1/2 rounded bg-muted" />
    </div>
  </div>
);

export default SkeletonCard;
