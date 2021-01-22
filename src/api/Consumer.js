function Consumer(initialQuota, rechargeDelayInMillis) {
  this.quota = initialQuota;
  this.lastRecharge = Date.now();
  this.rechargeDelayInMillis = rechargeDelayInMillis;

  const canRechargeQuota = () => {
    const timeSinceLastRecharge = Date.now() - this.lastRecharge;
    return timeSinceLastRecharge > rechargeDelayInMillis;
  };

  const attemptRechargeQuota = () => {
    if (canRechargeQuota()) {
      this.lastRecharge = Date.now();
      this.quota = initialQuota;
    }
  };

  return {
    consume: () => {
      attemptRechargeQuota();
      this.quota--;
      return {
        quota: this.quota,
        lastRecharge: this.lastRecharge,
      };
    },
  };
}

export default Consumer;
