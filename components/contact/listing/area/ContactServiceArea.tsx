interface ContactServiceAreaProps {
  business: {
    primaryServiceRegion: string;
  };
}

export default function ContactServiceArea({
  business,
}: ContactServiceAreaProps) {
  if (!business.primaryServiceRegion) {
    return null;
  }

  return (
    <section className="px-5 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-[#08263D] p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
            Service Region
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#F8FAFC]">
            {business.primaryServiceRegion}
          </h2>
        </div>
      </div>
    </section>
  );
}