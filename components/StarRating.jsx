export default function StarRating ({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400 text-[12px] sm:text-xl">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="text-yellow-400 text-[12px] sm:text-xl">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-zinc-300 text-[12px] sm:text-xl">
          ☆
        </span>
      ))}
    </div>
  );
};