.PHONY: test cov install install-test install-dev uninstall example clean

RM = rm -rf
PYTHON = python3


# ┏━━━━━━━━━┓
# ┃ Testing ┃
# ┗━━━━━━━━━┛

PYTEST = py.test
PYTEST_COV_OPTS ?= --cov=src --cov-report=term --no-cov-on-fail

test: clean
	$(PYTEST)

cov: clean
	$(PYTEST) $(PYTEST_COV_OPTS)

# ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
# ┃ Installing, building, running ┃
# ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

install: clean
	pip3 install --quiet --upgrade --upgrade-strategy eager -e .

install-test: clean
	pip3 install --quiet --upgrade --upgrade-strategy eager -e .[test]

install-dev: install-test
	pip3 install --quiet --upgrade --upgrade-strategy eager -e .[dev]

uninstall:
	pip3 uninstall -y cms_search && $(RM) src/cms_search.egg-info

example: clean
	python -m cms_search.cli --config example.config.yml


# ┏━━━━━━━━━━━━━┓
# ┃ Cleaning up ┃
# ┗━━━━━━━━━━━━━┛

clean:
	find . -type f -name '*.py[co]' -exec rm {} \;
	$(RM) .coverage .cache
