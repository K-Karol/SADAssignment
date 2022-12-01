/**
 * @jest-environment jsdom
 */

import {cleanup, fireEvent, render} from '@testing-library/react';
import GenerateCode from "./GenerateCode";

describe('Generate random code component', () => {
    it('should render the generate code button correctly', () => {
        const view = render(<GenerateCode/>);
        expect(view).toMatchSnapshot();
    })
});