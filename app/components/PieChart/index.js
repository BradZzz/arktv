/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsivePieCanvas } from '@nivo/pie'
import { CountByGenre, PickRandom } from '../../utils/mediaUtils'

function PieChart(props){

  const { media } = props
  const genres = CountByGenre(media)
  const data = []
  for (var genre of Object.keys(genres)) {
      data.push({
         "id": genre,
         "label": genre,
         "value": genres[genre],
         "color": `hsl(${PickRandom(1,400)}, 70%, 50%)`
      })
  }

  return <ResponsivePieCanvas
                 data={data}
                 margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
                 pixelRatio={1}
                 innerRadius={0.5}
                 padAngle={0.7}
                 cornerRadius={3}
                 colors={{ scheme: 'paired' }}
                 borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.6 ] ] }}
                 radialLabelsSkipAngle={10}
                 radialLabelsTextXOffset={6}
                 radialLabelsTextColor="#333333"
                 radialLabelsLinkOffset={0}
                 radialLabelsLinkDiagonalLength={16}
                 radialLabelsLinkHorizontalLength={24}
                 radialLabelsLinkStrokeWidth={1}
                 radialLabelsLinkColor={{ from: 'color' }}
                 slicesLabelsSkipAngle={10}
                 slicesLabelsTextColor="#333333"
                 animate={true}
                 motionStiffness={90}
                 motionDamping={15}
                 defs={[
                     {
                         id: 'dots',
                         type: 'patternDots',
                         background: 'inherit',
                         color: 'rgba(255, 255, 255, 0.3)',
                         size: 4,
                         padding: 1,
                         stagger: true
                     },
                     {
                         id: 'lines',
                         type: 'patternLines',
                         background: 'inherit',
                         color: 'rgba(255, 255, 255, 0.3)',
                         rotation: -45,
                         lineWidth: 6,
                         spacing: 10
                     }
                 ]}
                 fill={[
                     {
                         match: {
                             id: 'ruby'
                         },
                         id: 'dots'
                     },
                     {
                         match: {
                             id: 'c'
                         },
                         id: 'dots'
                     },
                     {
                         match: {
                             id: 'go'
                         },
                         id: 'dots'
                     },
                     {
                         match: {
                             id: 'python'
                         },
                         id: 'dots'
                     },
                     {
                         match: {
                             id: 'scala'
                         },
                         id: 'lines'
                     },
                     {
                         match: {
                             id: 'lisp'
                         },
                         id: 'lines'
                     },
                     {
                         match: {
                             id: 'elixir'
                         },
                         id: 'lines'
                     },
                     {
                         match: {
                             id: 'javascript'
                         },
                         id: 'lines'
                     }
                 ]}
                 legends={[
                     {
                         anchor: 'right',
                         direction: 'column',
                         translateX: 140,
                         itemWidth: 60,
                         itemHeight: 14,
                         itemsSpacing: 2,
                         symbolSize: 14,
                         symbolShape: 'circle'
                     }
                 ]}
             />
}

export default PieChart;

