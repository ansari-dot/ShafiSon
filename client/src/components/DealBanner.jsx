import { useEffect, useState } from "react";
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
  const showCountdown = hasDeadline && days + hours + mins + secs > 0;

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
    return () => {
      active = false;
    };
  }, []);

  const discountNode = (() => {
    const type = deal?.discountType || "percent";
    const value = typeof deal?.discountValue === "number" ? deal.discountValue : 0;
    if (type === "none") return null;
    if (type === "amount") return <span className="deal-accent">{formatPKR(value)} OFF</span>;
    return <span className="deal-accent">{value}% OFF</span>;
  })();

  return (
    <section className="deal-banner deal-banner-modern section-pad">
      <div className="container">
        <div className="deal-modern-shell">
          <div className="deal-modern-left">
            <div className="deal-modern-kicker">
              <span className="section-label">{deal?.title || "Limited Offer"}</span>
              {discountNode && <span className="deal-modern-chip">Limited • {discountNode}</span>}
            </div>

            <h2 className="deal-modern-title">
              {discountNode ? (
                <>
                  Premium picks.
                  <br />
                  <span className="deal-modern-title-strong">Save big today.</span>
                </>
              ) : (
                <>{deal?.heading || "Grab the Deal"}</>
              )}
            </h2>

            <p className="deal-modern-text">
              {deal?.text ||
                "Upgrade your living space with premium collections - crafted to feel expensive, priced to feel smart."}
            </p>

            <div className="deal-modern-actions">
              <a href="/shop?deal=1" className="btn-dark d-inline-flex align-items-center gap-2">
                Grab the Deal <span aria-hidden="true">→</span>
              </a>
              <a href="/shop" className="deal-modern-link">
                Explore all products
              </a>
            </div>

            {hasDeadline && (
              <div className="deal-modern-note">{showCountdown ? "Hurry up - offer ends soon." : "This offer has ended."}</div>
            )}
          </div>

          <div className="deal-modern-right">
            <div className="deal-modern-panel" aria-label="Deal countdown">
              <div className="deal-modern-panel-top">
                <div className="deal-modern-panel-title">Deal ends in</div>
                <div className="deal-modern-panel-sub">
                  {showCountdown ? "Don’t miss it." : hasDeadline ? "Deal time ended." : "Set a new deal end time in Admin."}
                </div>
              </div>

              <div className="deal-countdown deal-countdown-modern">
                {[
                  { val: days, label: "Days" },
                  { val: hours, label: "Hours" },
                  { val: mins, label: "Minutes" },
                  { val: secs, label: "Seconds" },
                ].map(({ val, label }) => (
                  <div className="countdown-block countdown-block-modern" key={label}>
                    <span className="countdown-num">{showCountdown ? String(val).padStart(2, "0") : "--"}</span>
                    <span className="countdown-label">{label}</span>
                  </div>
                ))}
              </div>

              {!hasDeadline && <div className="deal-modern-help">Admin → Content → Deal Section</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
