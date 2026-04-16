export default function HomeStoreLocation() {
  return (
    <section className="home-store-map-only">
      <div className="container">
        <div className="home-store-map-only-frame">
          <iframe
            title="ShafiSons Store Location"
            src="https://www.google.com/maps?q=Jinnah+Road+Quetta+Pakistan&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
