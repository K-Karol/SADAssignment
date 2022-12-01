import React from 'react';
import renderer from 'react-test-renderer';
import Unauthorised from './Unauthorised';
 
 describe("GenerateCode page renders properly", () => {
    it("Matches DOM Snapshot", () => {
      const domTree = renderer.create(<Unauthorised />).toJSON();
      expect(domTree).toMatchSnapshot();
    });
  });