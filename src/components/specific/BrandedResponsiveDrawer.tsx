import { Link } from 'gatsby';
import { Button } from 'gatsby-material-ui-components';
import * as React from 'react';
import { ResponsiveDrawer } from '../general';

type Props = Parameters<typeof ResponsiveDrawer>[0];

export function BrandedResponsiveDrawer(props: Props) {
  return (
    <ResponsiveDrawer brand={<Button variant="text" to="/" sx={{ flexGrow: 1, textAlign: 'center' }}>mon.arbre.app</Button>} {...props} />
  );
}
