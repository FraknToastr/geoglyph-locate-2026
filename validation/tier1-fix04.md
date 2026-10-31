# Tier 1 checkpoint 4 — worker generation recovery

Worker timeouts, error events and message decoding failures now invalidate the owned worker generation, terminate/revoke it and settle its pending jobs. Late callbacks are ignored. Public prepare/model/mesh operations retry an infrastructure failure once; permanent content errors remain cached. Retained metadata is distinct from parsed-font residency in the current worker; recovery rehydrates from copied font bytes. Disposal prevents in-flight recovery from restarting a worker.

All 11 focused worker recovery cases and all 10 existing font-rendering cases pass. Coverage includes repeated failure bounds, concurrent pending operations, old callbacks, malformed messages, exact-face retention, FONT_EVICTED and disposal, including disposal between preparation and model dispatch. Conference build succeeds. Existing successful caching checks remain passing; no frame/CPU gain is claimed from this reliability change. Browser validation is deferred; no browser/full battery/soak was run.

Revert this isolated commit and generated files if browser validation reveals lost font resources, unbounded retries, changed fallback policy or unsettled requests. The base studio and worker wire format are unchanged.
