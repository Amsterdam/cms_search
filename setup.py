#!/usr/bin/env python
"""See <https://setuptools.readthedocs.io/en/latest/>.
"""
from setuptools import setup, find_packages

setup(


    # ┏━━━━━━━━━━━━━━━━━━━━━━┓
    # ┃ Publication Metadata ┃
    # ┗━━━━━━━━━━━━━━━━━━━━━━┛
    version='1.0.0',
    name='datapunt-cms_search',
    description="Amsterdam Datapunt CMS Search",
    # TODO:
    # long_description="""
    #
    # """,
    url='https://github.com/Amsterdam/cms_search',
    author='Amsterdam City Data',
    author_email='datapunt@amsterdam.nl',
    license='Mozilla Public License Version 2.0',
    classifiers=[
        'License :: OSI Approved :: Mozilla Public License 2.0 (MPL 2.0)',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
    ],
    entry_points={
        'console_scripts': [
            'cms_search=cms_search.main:run'
        ]
    },


    # ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    # ┃ Packages and package data ┃
    # ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    package_dir={'': 'src'},
    packages=find_packages('src'),
    package_data={
        'cms_search': ['*.yml']
    },


    # ┏━━━━━━━━━━━━━━┓
    # ┃ Requirements ┃
    # ┗━━━━━━━━━━━━━━┛
    python_requires='~=3.6',
    install_requires=[
        'aiohttp',
        'aiohttp_cors',
        'aioelasticsearch',
        'datapunt_config_loader',
        'graypy',
        'jsonschema',
        'prometheus_client',
        'pyyaml',
        'pyld',

        # Recommended by aiohttp docs:
        'aiodns',    # optional asynchronous DNS client
        'uvloop',    # optional fast eventloop for asyncio
        'sentry-sdk',
    ],
    extras_require={
        'dev': [
            'aiohttp-devtools'
        ],
        'test': [
            'pytest',
            'pytest-cov',
            'pytest-aiohttp',
        ],
    },
    # To keep PyCharm from complaining about missing requirements:
    tests_require=[
        'pytest',
        'pytest-aiohttp',
    ],
)
