import React from 'react';
import renderer from 'react-test-renderer';
import RegisterAttendance from './RegisterAttendance';
 
// Snapshot test to ensure consistency of this component - spread to all if we have time.

 describe("Register Attendance page renders properly", () => {
    it("Matches DOM Snapshot", () => {
      const domTree = renderer.create(<RegisterAttendance />).toJSON();
      expect(domTree).toMatchSnapshot();
    });
  });