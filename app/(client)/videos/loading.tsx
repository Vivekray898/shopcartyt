import Container from "@/components/Container";
import Title from "@/components/Title";

const LoadingSkeleton = () => {
  return (
    <Container className="py-10">
      <div className="space-y-4 text-slate-900">
        <Title className="text-3xl font-bold">Latest Showroom Video Updates</Title>
        <p className="max-w-3xl text-base text-slate-600">
          Watch our physical item breakdowns and live showroom demonstrations. Synced automatically with our YouTube channel.
        </p>
      </div>

      <main className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <div className="aspect-video animate-pulse rounded-3xl bg-slate-200" />
            <div className="space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </main>
    </Container>
  );
};

export default LoadingSkeleton;
