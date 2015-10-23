export default function selectLocalVideo() {
    return new Promise((resolve, reject) => {
        if (!document) {
            return reject('This is not a web browser');
        }

        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.addEventListener('change', function () {
            var files = input.files;
            if (!files.length) {
                // The user didn't select anything.  Sad.
                console.log('no selection');
                return reject('File selection canceled');
            }

            var extension = files[0].name.split('.').pop();
            var fileUrl = URL.createObjectURL(files[0]);
            console.log('Loading local file ', files[0].name, ' at URL ', fileUrl, ' with extension ', extension);
            resolve({
                url: fileUrl,
                type: 'video/'+extension
            });
        });

        input.click();
    });

}
