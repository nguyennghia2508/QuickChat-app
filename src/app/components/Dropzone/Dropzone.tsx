// "use client"
// import "./dropzone.scss"
// import { useEffect, useState } from 'react';
// import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
// import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';
// import { useAppDispatch } from "@/app/store";
// import { setHandileFile } from "@/app/store/features/handleFileSlice";
// import { toast } from "react-toastify";

// const Dropzone = ({
//   isDropFile = false
// }) => {

//   const dispatch = useAppDispatch();

//   const maxSize = 2 * 1024 * 1024; // 250MB

//   interface CustomFile extends File {
//     preview: string;
//     convertSize: string
//   }

//   const [files, setFiles] = useState<CustomFile[]>([]);
//   const [rejected, setRejected] = useState<{ file: File; errors: any[] }[]>([]);

//   const bytesToMB = (bytes: number) => {
//     if (bytes < 1024) {
//       return bytes + ' bytes';
//     } else if (bytes < 1024 * 1024) {
//       const sizeInKB = bytes / 1024;
//       return sizeInKB % 1 === 0 ? sizeInKB + ' KB' : sizeInKB.toFixed(2) + ' KB';
//     } else if (bytes < 1024 * 1024 * 1024) {
//       const sizeInMB = bytes / (1024 * 1024);
//       return sizeInMB % 1 === 0 ? sizeInMB + ' MB' : sizeInMB.toFixed(2) + ' MB';
//     } else {
//       const sizeInGB = bytes / (1024 * 1024 * 1024);
//       return sizeInGB % 1 === 0 ? sizeInGB + ' GB' : sizeInGB.toFixed(2) + ' GB';
//     }
//   }

//   const onDrop = (
//     acceptedFiles: File[],
//     fileRejections: FileRejection[],
//     event: DropEvent
//   ) => {
//     if (acceptedFiles.length) {
//       setFiles(previousFiles => [
//         ...previousFiles,
//         ...acceptedFiles.map(file =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//             convertSize: bytesToMB(file.size)
//           })
//         )
//       ])
//       const value = {
//         files: acceptedFiles,
//         isSend: true
//       }
//       dispatch(setHandileFile(value))
//     }

//     if (fileRejections.length) {
//       // Handling rejected files
//       fileRejections.forEach(({ file, errors }) => {
//         errors.forEach((error) => {
//           if (error.code === 'file-too-large') {
//             // Hiển thị thông báo khi file có kích thước lớn hơn maxSize
//             toast.error(`File ${file.name} vượt quá kích thước tối đa cho phép (${bytesToMB(maxSize)}).`,
//               {
//                 position: 'top-right',
//                 autoClose: 3000,
//                 style: { color: '$color-default', backgroundColor: '#fff' },
//               });
//           }
//         });
//       });
//     }
//   };


//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     // accept: {
//     //     '*': ['.png'],
//     //     'image/jpg': ['.jpg'],
//     //     'image/jpeg': ['.jpeg'],
//     //     'text/html': ['.html', '.htm'],
//     // },
//     maxSize: maxSize,
//     onDrop,
//   });

//   //   useEffect(() => {
//   //     // Revoke the data uris to avoid memory leaks
//   //     return () => files.forEach(file => URL.revokeObjectURL(file.preview))
//   //   }, [files])


//   const removeFile = (indexToRemove: number) => {
//     setFiles((prevFiles) => {
//       return prevFiles.filter((file, index) => index !== indexToRemove);
//     });
//   };

//   const removeAll = () => {
//     setFiles([]);
//     setRejected([]);
//   };

//   const removeRejected = (name: string) => {
//     setRejected((files) => files.filter(({ file }) => file.name !== name));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!files.length) return;
//     console.log(files);
//   }

//   return (
//     <>
//       {isDropFile ?
//         <form onSubmit={handleSubmit} className='dropzone-file-input' {...getRootProps()}>
//           <div className="dropzone-item">
//             <input {...getInputProps()} />
//             <div className='flex flex-col items-center justify-center gap-4'>
//               <ArrowUpTrayIcon className='w-5 h-5 fill-current' />
//               {isDragActive ? (
//                 <p>Drop the files here ...</p>
//               ) : (
//                 <p>Drag & drop files here, or click to select files</p>
//               )}
//             </div>
//           </div>
//         </form>
//         :
//         files.map((file, index) => (
//           <div className="col-lg-4 my-3" key={index}>
//             <div className="card bg-light">
//               <div className="card-body p-3">
//                 <div className="media align-items-center">
//                   {file.type.startsWith('image/') ?
//                     <div className="dropzone-image-preview" style={{ display: 'block' }}>
//                       <div className="avatar avatar mr-5">
//                         <img src={file.preview} className="avatar-img rounded" data-dz-thumbnail="" alt={file.name} />
//                       </div>
//                     </div>
//                     :
//                     <div className="dropzone-file-preview">
//                       <div className="avatar avatar rounded bg-secondary text-basic-inverse d-block mr-5">
//                         <i className="fe-paperclip"></i>
//                       </div>
//                     </div>
//                   }

//                   <div className="media-body overflow-hidden">
//                     <h6 className="text-truncate small mb-0" data-dz-name="">{file.name}</h6>
//                     <p className="extra-small" data-dz-size="">
//                       <strong>{file.convertSize}</strong>
//                     </p>
//                   </div>

//                   <div className="ml-5">
//                     <a className="btn btn-sm btn-link text-decoration-none text-muted" data-dz-remove="" onClick={() => removeFile(index)}>
//                       <i className="fe-x"></i>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       }
//       {/* Preview */}

//     </>
//   );
// };

// export default Dropzone;
