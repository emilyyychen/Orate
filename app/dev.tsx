import React from 'react';
import { Redirect } from 'expo-router';

/** Development only. The conditional require lets release builds eliminate the gallery and its fixtures. */
export default function DevRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  const { DevGallery } = require('../components/design-system/DevGallery');
  return <DevGallery />;
}
