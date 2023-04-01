export function createMarkup(cards) {
  return cards
    .map(card => {
      return `<div class="photo-card">
  <img class="photo" src="${card.webformatURL}" data-source="${card.largeImageURL}" alt="${card.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${card.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${card.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${card.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${card.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
}
