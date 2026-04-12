import React from 'react'
import FullApp from './fullsrc/App'
import './fullsrc/index.css'

// Render the original `faction-image` app (ported into `fullsrc`) inside the harness.
// We'll later adapt this to read/write the canonical store via the bridge.
export default function FactionImagePort() {
  return <FullApp />
}
