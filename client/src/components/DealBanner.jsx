import { useState, useEffect } from "react";
import { apiGet } from "../util/api";
import { formatPKR } from "../util/formatCurrency";

function useCountdown(targetDate) {
  const calc = (date) => {
    const diff = date - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(() => calc(targetDate));
  useEffect(() => {
    setTime(calc(targetDate));
    const id = setInterval(() => setTime(calc(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

export default function DealBanner() {
  const [deal, setDeal] = useState(null);
  const hasDeadline = !!deal?.endsAt && !Number.isNaN(new Date(deal.endsAt).getTime());
  const deadline = hasDeadline ? new Date(deal.endsAt).getTime() : 0;
  const { days, hours, mins, secs } = useCountdown(deadline);
  const showCountdown = hasDeadline && deadline > Date.now();

  useEffect(() => {
    let active = true;
    apiGet("/api/deal-section")
      .then((doc) => {
        if (!active) return;
        setDeal(doc || null);
      })
      .catch(() => {
        if (!active) return;
        setDeal(null);
      });
    return () => { active = false; };
  }, []);

  const renderDiscount = () => {
    const type = deal?.discountType || "percent";
    const value = typeof deal?.discountValue === "number" ? deal.discountValue : 0;
    if (type === "none") return null;
    if (type === "amount") {
      return <span className="text-accent">{formatPKR(value)} Off</span>;
    }
    return <span className="text-accent">{value}% Off</span>;
  };

  return (
    <section className="deal-banner section-pad">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <span className="section-label">{deal?.title || "Limited Offer"}</span>
            <h2 className="fs-2 fw-bold text-dark mt-2 mb-3">
              {renderDiscount() ? (
                <>
                  Up to {renderDiscount()} on
                  <br />
                  Selected Furniture
                </>
              ) : (
                <>
                  {deal?.heading || "Grab the Deal"}
                </>
              )}
            </h2>
            <p className="mb-4">
              {deal?.text || "Upgrade your living space with our premium collection. Handcrafted pieces built to last a lifetime — at prices you'll love."}
            </p>
            <a href="/shop?deal=1" className="btn-accent d-inline-block">
              Grab the Deal
            </a>
          </div>
          <div className="col-lg-6">
            <div className="deal-countdown">
              {[
                { val: days, label: "Days" },
                { val: hours, label: "Hours" },
                { val: mins, label: "Minutes" },
                { val: secs, label: "Seconds" },
              ].map(({ val, label }) => (
                <div className="countdown-block" key={label}>
                  <span className="countdown-num">{showCountdown ? String(val).padStart(2, "0") : "--"}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            {!showCountdown && (
              <div className="small text-muted mt-2">
                {hasDeadline ? "Deal time ended." : "Set deal end time in Admin ? Content ? Deal Section."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
