import { Link } from 'gatsby-material-ui-components';
import * as React from 'react';
import { Individual } from '../../../db';
import { displayIndividualName } from '../../../util';
import { useFamilyTreeContext } from '../../context';

interface Props {
  individual?: Individual<{ names: true }>
}

export function IndividualLink({ individual }: Props) {
  const { familyTree } = useFamilyTreeContext();

  return individual ? (
    <Link to={`/tree/${familyTree?.displayId}/individual/${individual.pointer}`}>{displayIndividualName(individual)}</Link>
  ) : <>?</>;
}
