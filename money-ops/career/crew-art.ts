/** Keep the uploaded poster intact. Only Everest's approved head region is
 * composited from the retouched poster; the other five crew and all surrounding
 * poster pixels always come from the unchanged original reference. */
export const everestHeadRegion={x:504,y:315,width:90,height:90};
export const approvedCrewEdit='assets/crew/moneybread-city-everest-approved.png?v=45.6';
let instance=0;
export function everestPatchLayer(scope:string):string {
 const id=`everest-head-${scope}-${++instance}`,r=everestHeadRegion;
 return `<defs><clipPath id="${id}"><rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}"/></clipPath></defs><image data-everest-approved href="${approvedCrewEdit}" width="1280" height="748" preserveAspectRatio="none" clip-path="url(#${id})"/>`;
}
export function everestPatchOverlay(scope:string):string {
 return `<svg class="everest-approved-patch" viewBox="0 0 1280 748" aria-hidden="true" focusable="false">${everestPatchLayer(scope)}</svg>`;
}
