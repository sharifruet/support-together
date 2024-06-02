import React, { useState } from 'react';

const CustomFileUpload = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    console.log(modalOpen)
  };

  const previewFiles = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const input = document.getElementById('inputUp');
      const preview = document.querySelector('.preview');

      preview.innerHTML = '';

      const files = input.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const reader = new FileReader();
        reader.onload = (e) => {
          const fileType = file.type.split('/')[0];
          let mediaElement;
          if (fileType === 'image') {
            mediaElement = `<img src="${e.target.result}" class="mr-3 images" alt="..." onclick="zoomImage(this)" />`;
          } else if (fileType === 'video') {
            mediaElement = `<video src="${e.target.result}" class="mr-3 images" alt="..." onclick="zoomImage(this)" controls></video>`;
          } else if (fileType === 'audio') {
            mediaElement = `<audio src="${e.target.result}" class="mr-3 images" alt="..." onclick="zoomImage(this)" controls></audio>`;
          }
          preview.innerHTML += mediaElement;
        };
        reader.readAsDataURL(file);
      }
    }, 1000); // Simulating loading time
  };

  const zoomImage = (element) => {
    const preview = document.querySelector('.preview');
    const clonedElement = element.cloneNode(true);

    if (!clonedElement.classList.contains('zoomed')) {
      clonedElement.classList.add('zoomed');
      clonedElement.classList.remove('images');
      clonedElement.onclick = () => cancelPreview(element);

      preview.appendChild(clonedElement);
    } else {
      cancelPreview(element);
    }
  };

  const cancelPreview = (element) => {
    const preview = document.querySelector('.preview');
    const zoomedElement = preview.querySelector('.zoomed');
    if (zoomedElement) {
      preview.removeChild(zoomedElement);
    } else {
      preview.removeChild(element);
    }
  };

  return (
    <div>
      
        <div className="modal fade modal-lg" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="indicator"></div>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel"></h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="media mb-3">
                  <img src="https://s3.amazonaws.com/creativetim_bucket/new_logo.png" className="mr-3 images" alt="..." />
                  <div className="media-body">
                    <textarea className="autosize" placeholder="add..." rows="1" id="note" data-emoji="true"></textarea>
                    <div className="position-relative">
                      <input type="file" className="d-none" accept="audio/*|video/*|video/x-m4v|video/webm|video/x-ms-wmv|video/x-msvideo|video/3gpp|video/flv|video/x-flv|video/mp4|video/quicktime|video/mpeg|video/ogv|.ts|.mkv|image/*|image/heic|image/heif" onChange={previewFiles} id="inputUp" multiple />
                      <a className="mediaUp mr-4"><i className="material-icons mr-2" data-tippy="add (Video, Audio, Photo)" onClick={previewFiles}>perm_media</i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row col-md-12 ml-auto mr-auto preview"></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={toggleModal}>Close</button>
                <span className="btn btn-info btn-sm" disabled>Save changes</span>
              </div>
            </div>
          </div>
        </div>
      
      {loading && (
        <div className="loader-container">
          <div className="lds-hourglass"></div>
        </div>
      )}
    </div>
  );
};

export default CustomFileUpload;
