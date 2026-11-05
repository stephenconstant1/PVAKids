/** Keep the uploaded poster intact. Only Everest's approved head region is
 * composited from the retouched poster; the other five crew and all surrounding
 * poster pixels always come from the unchanged original reference. */
export declare const everestHeadRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const approvedCrewEdit = "assets/crew/CMI_moneybread-city-crew-approved-everest.png?v=45.6";
export declare function everestPatchLayer(scope: string): string;
export declare function everestPatchOverlay(scope: string): string;
