import React from 'react'
import Image from 'next/image'

interface Props {
  collectedAmount: number;
  amountLastUpdated: string;
  totalDistanceKm: number;

}

const Description = ({ collectedAmount, totalDistanceKm, amountLastUpdated }: Props) => {
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
          <strong>Turning Kilometers into Solidarity </strong></h1>



        <p>I am embarking on an exciting journey with a simple mission:
          for each kilometer I complete, I aim to raise €1 to support the 🐶🐈 <a href='https://spa33.fr/' target="_blank">Bordeaux SPA animal shelter </a>.</p>

        <p>This shelter is dedicated to caring for and protecting abandoned and vulnerable animals. Your support helps provide food, medical care, and shelter to these animals in need.</p>


        <p>Whether I hike 10 kilometers or 100, every euro you contribute will directly support this vital cause.</p>
        <div className='flexbox-vertical-conatiner'>
          <p style={{ margin: "20px" }}>Would you consider <span style={{ color: "#fd5770" }}>sponsoring one kilometer</span> of my journey?</p>
          <a href="https://www.leetchi.com/fr/c/hike-donate-1755564" target="_blank">
            <Image
              src="/donate-link.svg"
              width="60"
              height="60"
              alt="Donate icon"
            />
          </a>
        </div>
        <p className="note">**All funds collected through this
          Leetchi campaign will be donated in full to the nonprofit association
          Bordeaux SPA .
          I take full personal responsibility for ensuring that the collected money is securely transferred and received by the association after the campaign ends.</p>
      </div>
    </div>
  )
}

export default Description