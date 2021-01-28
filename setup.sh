#!/bin/bash

set -e

dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

if [[ -d public-gedcoms ]]
then
  cd public-gedcoms
  git pull
  cd ..
else
  git clone git@github.com:arbre-app/public-gedcoms.git public-gedcoms
fi

rm public/gedcoms/*.ged

cp public-gedcoms/files/*.ged public/gedcoms/
