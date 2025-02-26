/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './Dialog.css'

import * as React from 'react'

export function DialogButtonsList({ children }) {
    return <div className="DialogButtonsList">{children}</div>
}

export function DialogActions({ 'data-test-id': dataTestId, children }) {
    return (
        <div className="DialogActions" data-test-id={dataTestId}>
            {children}
        </div>
    )
}
