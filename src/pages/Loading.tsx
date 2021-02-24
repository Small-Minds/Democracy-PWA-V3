import React, { FC } from 'react';
import { FlexboxGrid, Loader } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';

const Loading: FC<{ half?: boolean }> = ({ half }) => {
  return (
    <FlexboxGrid
      align="middle"
      justify="center"
      style={{ height: half ? '30vh' : '90vh' }}
    >
      <FlexboxGridItem>
        <Loader size="lg" speed="slow" vertical />
      </FlexboxGridItem>
    </FlexboxGrid>
  );
};

export default Loading;
