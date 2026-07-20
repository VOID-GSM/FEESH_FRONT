interface PhotoUploadProps {
  photos: File[];
  setPhotos: (photos: File[]) => void;
}

function PhotoUpload({ photos, setPhotos }: PhotoUploadProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length > 5) {
      alert("사진은 최대 5장까지 첨부할 수 있습니다.");
      return;
    }

    setPhotos(files);
  };

  return (
    <div>
      <label className="flex items-center gap-stack-sm p-4 border-2 border-dashed rounded-xl cursor-pointer">
        <span className="material-symbols-outlined">add_a_photo</span>

        <span>사진 첨부 (최대 5장)</span>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
      </label>

      {photos.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={URL.createObjectURL(photo)}
              alt={`preview-${index}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
