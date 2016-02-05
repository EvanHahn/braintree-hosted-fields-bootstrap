#!/usr/bin/env bash
set -e
set -u

tmpdir="/tmp/braintree-hosted-fields-bootstrap-$RANDOM"

git checkout master

cp -r example/ "$tmpdir"
cat example/index.html | sed 's|\.\./braintree|braintree|' > "$tmpdir/index.html"
cp braintree-hosted-fields-bootstrap.js "$tmpdir"

git checkout gh-pages

rm -rf -- *
mv $tmpdir/* .
rm -rf "$tmpdir"

git add .
git commit -m 'gh-pages'
git push origin gh-pages

git checkout master
