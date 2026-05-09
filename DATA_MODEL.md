# Firestore Data Model

## Collection: `incidents`
Reported disaster events from community members or officers.

```
{
  type:         string,    // "Flood" | "Drought" | "Landslide" | etc.
  county:       string,    // e.g. "Meru"
  severity:     string,    // "Low" | "Medium" | "High" | "Critical"
  description:  string,    // Free text description
  reporterName: string,    // Optional — reporter's name
  lat:          number,    // Derived from county centroid
  lng:          number,
  status:       string,    // "active" | "resolved"
  createdAt:    timestamp,
  resolvedAt:   timestamp  // Optional — set when resolved
}
```

## Collection: `alerts`
System-generated or admin-issued alerts (weather triggers, official warnings).

```
{
  type:      string,    // "Flood Warning" | "Heatwave Alert" | etc.
  severity:  string,    // "Low" | "Medium" | "High" | "Critical"
  county:    string,
  message:   string,
  source:    string,    // "system" | "admin" | "KMD" (Kenya Met Dept)
  createdAt: timestamp
}
```

## Collection: `shelters`
Emergency shelter locations.

```
{
  name:      string,
  county:    string,
  lat:       number,
  lng:       number,
  capacity:  number,
  contact:   string,
  active:    boolean
}
```

## Indexes needed in Firebase Console:
- incidents: status ASC, createdAt DESC
- alerts: createdAt DESC
