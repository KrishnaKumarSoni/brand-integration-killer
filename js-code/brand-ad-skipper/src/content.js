console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);

  if (request.action === 'injectSkipButtons') {
    const { analysis } = request;

    analysis.forEach(item => {
      const startTime = parseFloat(item.start);
      const endTime = parseFloat(item.end);
      const content = item.content;

      const skipButton = document.createElement('button');
      skipButton.innerText = 'Skip ad';
      skipButton.style.position = 'absolute';
      skipButton.style.bottom = '10px';
      skipButton.style.right = '10px';
      skipButton.style.zIndex = '1000';
      skipButton.style.padding = '10px';
      skipButton.style.backgroundColor = '#FF0000';
      skipButton.style.color = '#FFFFFF';
      skipButton.style.border = 'none';
      skipButton.style.borderRadius = '5px';
      skipButton.style.cursor = 'pointer';

      skipButton.onclick = () => {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime = endTime;
          skipButton.remove();
        }
      };

      const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video && video.currentTime >= startTime && !document.contains(skipButton)) {
          document.body.appendChild(skipButton);
        }
        if (video && video.currentTime >= endTime) {
          skipButton.remove();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      document.querySelector('video').addEventListener('ended', () => {
        observer.disconnect();
      });
    });

    sendResponse({ success: true });
  }
});

const videoUrl = window.location.href;
chrome.runtime.sendMessage({ action: 'fetchAndAnalyzeTranscript', url: videoUrl }, (response) => {
  console.log('Response from background script:', response);

  if (response.success) {
    chrome.runtime.sendMessage({ action: 'injectSkipButtons', analysis: response.analysis });
  } else {
    console.error('Failed to fetch and analyze transcript:', response.error);
  }
});
