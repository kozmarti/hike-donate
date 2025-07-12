import React from 'react'
import Image from 'next/image'
import CollectedAmountGauge from './CollectedAmountGauge'
import { FaHeart } from "react-icons/fa";

interface Props {
    collectedAmount: number;
    amountLastUpdated: string;
    totalDistanceKm: number;

}

const Description = ({collectedAmount, totalDistanceKm, amountLastUpdated}: Props) => {
  return (
    <div className='map-wrapper description-wrapper'>
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
    for each kilometer I complete, I aim to raise €1 to support the people 
    of Ukraine through the <Image
          style={{ display: 'inline-block' }}
              src="/ukraine.png"
              width="20"
              height="20"
              alt="Donate icon"
            /> <a href='https://france-ukraine.com/' target="_blank">
    Association France-Ukraine</a> . </p>

  <p>This association is dedicated to providing emergency assistance to Ukrainians affected by the war. Their work helps meet essential needs such as food, medical aid, and shelter.</p>

  <p>Each step I take is a symbol of solidarity — with those forced to flee their homes, those living under constant threat, and those fighting every day to survive.</p>

  <p>Whether I hike 10 kilometers or 100, every euro you contribute will directly support this humanitarian cause.</p>
    <div className='flexbox-vertical-conatiner'>
    <CollectedAmountGauge collectedAmount={collectedAmount} amountLastUpdated={amountLastUpdated} distance={totalDistanceKm}/>
{totalDistanceKm > collectedAmount && (
  <p className="distance-info"><strong>{collectedAmount} km</strong> already covered <FaHeart style={{display: "inline", color: "#6BFFAE"}} />
, <strong>{totalDistanceKm - collectedAmount} km</strong> still waiting for sponsors.</p>    
)}
{totalDistanceKm <= collectedAmount && (
  <p className="distance-info"> <strong>{totalDistanceKm} km</strong> hiked, <strong>€{collectedAmount} </strong> raised — all covered, thank you! <FaHeart style={{display: "inline", color: "#6BFFAE"}} />
</p>    
)}
  <p style={{margin: "20px"}}>Would you consider <span style={{color: "#fd5770"}}>sponsoring one kilometer</span> of my journey?</p>
  <a href="">
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
  France-Ukraine.
I take full personal responsibility for ensuring that the collected money is securely transferred and received by the association after the campaign ends.</p>
    </div>
    </div>
  )
}

export default Description