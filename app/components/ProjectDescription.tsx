import React from 'react'
import Image from 'next/image'
import DOMPurify from 'dompurify';
import { getGoalMeasure, GoalMeasureKey } from '../entities/GoalMeasureConfig';

interface Props {
  fundraiserDescription: string
  goalMeasure: GoalMeasureKey
  fundraiserUrl: string
}

const ProjectDescription = ({fundraiserDescription, goalMeasure, fundraiserUrl}: Props) => {
  const goalMeasureOfUser = getGoalMeasure(goalMeasure)
  return (
    <div className='map-wrapper description-wrapper' id='fundraising-description'>
      <div className="description-container">

        <h1 className="flexbox-horizontal-conatiner">
          <strong>
            My Fundraising Hike </strong>
          <Image
            style={{ display: 'inline-block' }}
            src="/donation-heart.svg"
            width="50"
            height="50"
            alt="Donate icon"
          />
          <strong>Turning {goalMeasure} into Solidarity </strong></h1>
          <p>I am embarking on an exciting journey with a simple mission:
          for each {goalMeasureOfUser.singular_detail}, I aim to raise €1.</p>
        <p style={{textAlign: "start", paddingLeft: "20px"}} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fundraiserDescription)}}/>
        <div className='flexbox-vertical-conatiner'>
          <p style={{ margin: "20px" }}>Would you consider <span style={{ color: "#fd5770" }}>sponsoring one {goalMeasureOfUser.singular}</span> of my journey?</p>
          <a href={fundraiserUrl} target="_blank">
            <Image
              src="/donate-link.svg"
              width="60"
              height="60"
              alt="Donate icon"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectDescription