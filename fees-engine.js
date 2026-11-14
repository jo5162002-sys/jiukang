(function (root) {
  'use strict';
  // Round the copayment for each service unit, then sum the units.
  function calculate(config, state) {
    var identity = state.idn, level = String(state.lv);
    var rate = config.copayRates[identity].rate;
    var limit = Math.max(0, Number(state.careAvailable ?? config.monthlyLimits[level]));
    var rlimit = Math.max(0, Number(state.respiteAvailable ?? config.respiteLimits[level]));
    var careLeft = limit, respiteLeft = rlimit;
    var r = {raw:0,self:0,gov:0,careRaw:0,respRaw:0,limit:limit,rlimit:rlimit,excess:0,rExcess:0,careSelf:0,respSelf:0,det:[],hasFix:false};
    function add(item, quantity, category, unit, respite) {
      var qty = Math.max(0, Math.min(9999, Math.floor(Number(quantity) || 0)));
      if (!qty) return;
      var subtotal = item.price * qty;
      r.det.push({cat:category,name:item.name,qty:qty,unit:unit,sub:subtotal});
      r.raw += subtotal;
      if (respite) r.respRaw += subtotal; else r.careRaw += subtotal;
      for (var n = 0; n < qty; n++) {
        var available = respite ? respiteLeft : careLeft;
        var covered = Math.min(item.price, available);
        var excess = item.price - covered;
        var copay = item.fixedCopay
          ? Math.floor(item.fixedCopay[identity] * covered / item.price)
          : Math.floor(covered * rate + 1e-9);
        if (item.fixedCopay) r.hasFix = true;
        r.self += copay + excess;
        if (respite) {respiteLeft -= covered;r.respSelf += copay;r.rExcess += excess;}
        else {careLeft -= covered;r.careSelf += copay;r.excess += excess;}
      }
    }
    add({price:config.dayCareRates[level][state.tm],name:'日間照顧（第 '+level+' 級／'+(state.tm==='full'?'全日':'半日')+'）'},Math.min(31,state.days),'日間照顧','天',false);
    config.serviceItems.forEach(function(item){add(item,(state.q||{})[item.code],'居家照顧','次',false)});
    config.otherItems.forEach(function(item){var respite=item.code.startsWith('GA');add(item,(state.q||{})[item.code],respite?'喘息服務':'其他服務',item.unit,respite)});
    r.gov = r.raw - r.self;
    return r;
  }
  root.JiukangFees = {calculate:calculate};
})(typeof window !== 'undefined' ? window : globalThis);
