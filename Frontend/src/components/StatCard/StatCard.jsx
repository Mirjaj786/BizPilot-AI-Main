import {
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoRemoveOutline,
} from "react-icons/io5";

const trendStyles = {
  up: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  down: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  neutral: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
};

const colorSchemes = {
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
  green: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
  orange: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
  red: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800",
  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800",
  neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "neutral",
  subtext,
  colorScheme = "blue",
  change,
  timeframe,
  badgeText,
  badgeType = "blue",
}) {
  const isUp = trend === "up" || trendType === "up";
  const displayTrendText = change !== undefined ? change : trend;

  return (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 group">
      {/* Top row: Title & Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${colorSchemes[colorScheme] || colorSchemes.blue}`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="my-3 flex items-baseline justify-between">
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          {value}
        </p>
        {badgeText && (
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorSchemes[badgeType] || colorSchemes.blue}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Footer: Trend badge & Subtext/Timeframe */}
      {(displayTrendText || subtext || timeframe) && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap text-xs">
          {displayTrendText && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap border ${
                isUp
                  ? trendStyles.up
                  : trendType === "down"
                  ? trendStyles.down
                  : trendStyles.neutral
              }`}
            >
              {isUp ? (
                <IoTrendingUpOutline size={14} />
              ) : trendType === "down" ? (
                <IoTrendingDownOutline size={14} />
              ) : (
                <IoRemoveOutline size={14} />
              )}
              {displayTrendText}
            </span>
          )}
          {(subtext || timeframe) && (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {subtext || timeframe}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
