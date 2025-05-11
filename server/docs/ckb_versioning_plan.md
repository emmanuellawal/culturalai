# Cultural Knowledge Base (CKB) Versioning and Audit Trail Plan

## Overview

This document outlines the plan for implementing versioning and audit trails for the Cultural Knowledge Base (CKB) entries. This is important for tracking changes to cultural data over time, maintaining data integrity, and ensuring accountability.

## Goals

1. Track all changes to CKB entries
2. Maintain a history of previous versions
3. Record who made changes and when
4. Provide ability to revert to previous versions if needed
5. Support data quality assurance processes

## Implementation Plan

### Phase 1: Basic Versioning (Post-MVP)

1. **Database Schema Updates**
   - Add versioning tables for each CKB entity type:
     - `CulturesVersions`
     - `CulturalNormsVersions`
     - `IdiomsVersions`
     - `ScenariosVersions`
     - `ScenarioChoicesVersions`
   - Each versioning table will include:
     - All fields from the original table
     - `VersionID` (primary key)
     - `EntityID` (foreign key to the original entity)
     - `VersionNumber` (incremental version number)
     - `ChangedBy` (UserID of the admin who made the change)
     - `ChangedAt` (timestamp)
     - `ChangeReason` (text description of why the change was made)
     - `ChangeType` (CREATE, UPDATE, DELETE)

2. **Triggers/Procedures**
   - Create database triggers or application-level hooks that automatically:
     - Create a new version record when an entity is created
     - Create a new version record when an entity is updated
     - Create a new version record when an entity is deleted (logical deletion)

3. **API Enhancements**
   - Update admin API endpoints to:
     - Require a `changeReason` parameter for all write operations
     - Return version information in responses

### Phase 2: Advanced Versioning and Audit (Future)

1. **Diff Tracking**
   - Store only the differences between versions rather than complete copies
   - Implement algorithms to reconstruct full versions from diffs

2. **Version Comparison UI**
   - Add admin UI features to:
     - View side-by-side comparisons of different versions
     - Highlight specific changes between versions
     - Allow filtering version history by date range, user, etc.

3. **Reversion Capabilities**
   - Implement functionality to revert to a previous version
   - Create new version records when reversions occur

4. **Approval Workflows**
   - Implement multi-step approval processes for sensitive changes
   - Track approval history in the versioning system

## Data Structure Example

```sql
CREATE TABLE CulturesVersions (
  VersionID NVARCHAR(36) PRIMARY KEY,
  CultureID NVARCHAR(36) NOT NULL,
  VersionNumber INT NOT NULL,
  CultureName NVARCHAR(100) NOT NULL,
  Region NVARCHAR(100) NOT NULL,
  PrimaryLanguage NVARCHAR(100) NOT NULL,
  Description NVARCHAR(MAX) NOT NULL,
  LastUpdated DATETIME2 NOT NULL,
  ChangedBy NVARCHAR(36) NOT NULL,
  ChangedAt DATETIME2 NOT NULL,
  ChangeReason NVARCHAR(MAX) NOT NULL,
  ChangeType NVARCHAR(10) NOT NULL,
  CONSTRAINT FK_CulturesVersions_Cultures FOREIGN KEY (CultureID) REFERENCES Cultures(CultureID)
);
```

## API Usage Example

```javascript
// Example API call to update a culture with versioning
PUT /api/admin/cultures/jp-001
{
  "CultureName": "Japanese",
  "Region": "East Asia",
  "PrimaryLanguage": "Japanese",
  "Description": "Updated description with more details about Japanese culture...",
  "_meta": {
    "changeReason": "Updated description to include more details about business etiquette"
  }
}
```

## Implementation Timeline

- **Phase 1**: To be implemented after the MVP release
- **Phase 2**: To be considered for future releases based on user feedback and business requirements

## Conclusion

This versioning and audit trail system will ensure that all changes to the Cultural Knowledge Base are tracked, providing transparency and accountability while maintaining data integrity. The phased approach allows for basic versioning to be implemented relatively quickly after the MVP, with more advanced features added as needed in the future. 