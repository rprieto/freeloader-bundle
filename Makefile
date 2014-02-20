
unit:
	@node_modules/.bin/mocha --grep Integration --invert

integration:
	@node_modules/.bin/mocha --grep Integration

.PHONY: integration
