import { PumpListItem, PumpDetail, FetchPumpsParams } from "@/types/pump";

const API_URL =
  process.env.NEXT_PUBLIC_PUMP_API_URL ||
  "https://xy8k2fbn87.execute-api.eu-west-1.amazonaws.com/staging/graphql";

const API_KEY =
  process.env.PUMP_API_KEY ||
  process.env.NEXT_PUBLIC_PUMP_API_KEY ||
  "Uncover-Broker-Parish6-Varying-Satirical";

const LIST_PUMPS_QUERY = `
  query listPumps($limit: Int!, $skip: Int!) {
    forms(
      limit: $limit
      skip: $skip
      definitionIdsIn: ["wfz-pump-installation-or-maintenance"]
      includePhotos: true
    ) {
      id
      createdTime
      data {
        ... on WfzPumpInstallationOrMaintenanceForm {
          titleOfPump
          pumpLocation {
            village
            area
            country
          }
          socialInformation {
            noOfPeopleServed
          }
          referencedPhotos {
            thumb: url(width: 480)
          }
        }
      }
    }
  }
`;

const GET_PUMP_QUERY = `
  query getPump($id: Id!) {
    forms(ids: [$id], includePhotos: true) {
      id
      createdTime
      data {
        ... on WfzPumpInstallationOrMaintenanceForm {
          referencedPhotos {
            thumb: url(width: 480)
            full: url(width: 1920)
          }
          titleOfPump
          idDetails {
            latitude
            longitude
          }
          pumpLocation {
            village
            area
            country
          }
          photosOfInstallation {
            donorOrPumpDedication {
              title
              value
            }
          }
          socialInformation {
            noOfPeopleServed
          }
          commentAndStory {
            commentAndStoryOfInstallationOrMaintenance
          }
        }
      }
    }
  }
`;

export async function fetchPumps(
  params: FetchPumpsParams = {}
): Promise<PumpListItem[]> {
  const { limit = 60, skip = 0 } = params;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-REQUEST-TYPE": "GraphQL",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        query: LIST_PUMPS_QUERY,
        variables: { limit, skip },
      }),
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message || "GraphQL error");
    }

    return (json.data?.forms as PumpListItem[]) || [];
  } catch (error) {
    console.error("Failed to fetch pumps:", error);
    throw error;
  }
}

export async function fetchPumpById(id: string): Promise<PumpDetail | null> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-REQUEST-TYPE": "GraphQL",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        query: GET_PUMP_QUERY,
        variables: { id },
      }),
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message || "GraphQL error");
    }

    const forms = (json.data?.forms as PumpDetail[]) || [];
    return forms[0] || null;
  } catch (error) {
    console.error(`Failed to fetch pump ${id}:`, error);
    throw error;
  }
}
