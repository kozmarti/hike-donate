import React from 'react'

interface EditableImageComponentProps {
  imageUrls: string[];
  onClearImage: (index: number) => void;
}

export const EditableImageComponent = ({imageUrls, onClearImage} : EditableImageComponentProps) => {
  return (
    <div className="phot-upload-container px-4 py-4">
    {imageUrls.map((url: string, index: number) => (
      <div key={index} className="space-y-2">
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="border rounded shadow"
            width={200}
          />
          <button
            onClick={() => onClearImage(index)}  // Call parent's function on click
            className="bg-red-600 text-white hover:bg-red-700 hover:text-white px-4 py-2 rounded-md"
          >
            Delete photo
          </button>
      </div>
    ))}
  </div>
  )
}

export default EditableImageComponent