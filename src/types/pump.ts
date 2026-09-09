export interface ReferencedPhoto {
  thumb?: string | null;
  full?: string | null;
}

export interface PumpLocation {
  village?: string | null;
  area?: string | null;
  country?: string | null;
}

export interface DonorDedication {
  title?: string | null;
  value?: string | null;
}

export interface PumpListItem {
  id: string;
  createdTime: number;
  data: {
    titleOfPump?: string | null;
    pumpLocation?: PumpLocation | null;
    socialInformation?: {
      noOfPeopleServed?: number | null;
    } | null;
    referencedPhotos?: ReferencedPhoto[];
  };
}

export interface PumpDetail {
  id: string;
  createdTime: number;
  data: {
    titleOfPump?: string | null;
    idDetails?: {
      latitude?: number | null;
      longitude?: number | null;
    } | null;
    pumpLocation?: PumpLocation | null;
    photosOfInstallation?: {
      donorOrPumpDedication?: DonorDedication[];
    } | null;
    socialInformation?: {
      noOfPeopleServed?: number | null;
    } | null;
    commentAndStory?: {
      commentAndStoryOfInstallationOrMaintenance?: string | null;
    } | null;
    referencedPhotos?: ReferencedPhoto[];
  };
}

export interface FetchPumpsParams {
  limit?: number;
  skip?: number;
}
