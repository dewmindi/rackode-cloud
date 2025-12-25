import { Card } from "./UI";


const datacenters = [
  { name: "Los Angeles DC-03", x: "60%", y: "60%" }, // These will need adjustment!
  { name: "San Jose", x: "68%", y: "55%" },
  { name: "Seattle", x: "51%", y: "75%" },
  { name: "Chicago", x: "45%", y: "45%" },
  { name: "Dallas", x: "50%", y: "65%" },
  { name: "New York", x: "55%", y: "40%" },
  { name: "Ashburn", x: "58%", y: "45%" },
  { name: "Toronto", x: "52%", y: "35%" },
];

export const DatacenterMap = () => {
  return (
    <Card className="relative w-full max-w-5xl mx-auto bg-gradient-to-b from-card to-muted/20 border-2">
      <div className="aspect-[2/1] relative overflow-hidden rounded-lg bg-gradient-to-br from-background via-muted/10 to-muted/30">

        {/* North America Map Background (subtle) */}
        <div className="absolute inset-0 sm:-inset-4inset-0 z-0"> {/* Map: z-0 (bottom) */}
          <img
            src="/north-america.svg"
            alt="North America Map"
            className="w-full h-full object-contain"
            style={{ filter: 'grayscale(100%) brightness(0.8)' }}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 z-10"> {/* Grid: z-10 (above map) */}
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {[...Array(11)].map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="50" stroke="currentColor" strokeWidth="0.3" />
            ))}
            {[...Array(6)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="currentColor" strokeWidth="0.3" />
            ))}
          </svg>
        </div>

        {/* Network connections (Below datacenter points, so points are clickable) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20"> {/* Lines: z-20 (above grid, below points) */}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {datacenters.slice(0, -1).map((dc, index) => {
            const nextDc = datacenters[index + 1];
            return (
              <line
                key={index}
                x1={dc.x}
                y1={dc.y}
                x2={nextDc.x}
                y2={nextDc.y}
                stroke="url(#connectionGradient)"
                strokeWidth="1.5"
                className="text-primary opacity-60"
              />
            );
          })}
        </svg>

        {/* Datacenter indicators (Highest z-index for hover interaction) */}
        {datacenters.map((dc, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30" // Increased to z-30
            style={{ left: dc.x, top: dc.y }}
          >
            {/* Pulse effects */}
            <div className="absolute w-8 h-8 bg-primary/20 rounded-full datacenter-pulse transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
            <div className="absolute w-6 h-6 bg-primary/30 rounded-full datacenter-pulse transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-4 h-4 bg-primary/40 rounded-full datacenter-pulse transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{ animationDelay: '1s' }}></div>

            {/* Center dot */}
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg relative z-10 group-hover:scale-125 transition-transform"></div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-20 shadow-lg">
              <div className="font-semibold">{dc.name}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200">Active</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced legend */}
      <div className="p-4 text-center border-t bg-card/50">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Active Datacenters ({datacenters.length} locations)</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>99.9% Uptime Guarantee</span>
          </div>
        </div>
      </div>
    </Card>
  );
};