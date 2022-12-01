import { ResponsiveLine } from '@nivo/line';
import data from './data.json';

// import Dropdown from 'react-dropdown';
// import styles from './ViewAttendanceLine.css'
//         data={data} and import for when needed. Placeholder for now?
// get the individual student select working

// This will take JSON data from the server
// not sure which route yet
// may need to containerise to avoid repeated API requests
// we'll need to get USERS, their ATTENDANCE, and possibly their COURSE

// Right now this is fed with sample data ONLY. We'd need a similar format from the server to do this
// i.e. list of modules and who uses them
const Line = () => (
    <ResponsiveLine
        data={data}
        margin={{
            top: 50,
            right: 110,
            bottom: 50,
            left: 60
          }}
          xScale={{
            type: 'point'
          }}
          yScale={{
            type: 'linear',
            stacked: true,
            min: 'auto',
            max: 'auto'
          }}
          minY="auto"
          maxY="auto"
          stacked={true}
          curve="cardinal"
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Module',
            legendOffset: 36,
            legendPosition: 'center'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Sessions Attended',
            legendOffset: -40,
            legendPosition: 'center'
          }}
          dotSize={10}
          dotColor="inherit:darker(0.3)"
          dotBorderWidth={2}
          dotBorderColor="#ffffff"
          enableDotLabel={true}
          dotLabel="y"
          dotLabelYOffset={-12}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
);

export default function ViewOverallAttendance () {
    return (
        <div style={{height: 800}}>
            <Line/>
        </div>
    )
}

    // use sorts and filters here
    // Graph component will be created - grafana etc
    // Comparison component probably also needed
    // By cohort and by inddividual - might need to split
    // i.e. view student attendance, view class attendance
    // split into different views, hold in ViewAttendance
    // hold in container for API calls.