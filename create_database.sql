-- Cultural Nuance Navigator Database Setup Script
-- This script creates the database and all required tables for the application

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CulturalAI')
BEGIN
    CREATE DATABASE CulturalAI;
END
GO

USE CulturalAI;
GO

-- Enable foreign key constraints
SET FOREIGN_KEY_CHECKS=1;

-- -----------------------------------------------------
-- Table structure for Users
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Users] (
  UserID NVARCHAR(36) PRIMARY KEY,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  HashedPassword NVARCHAR(255) NOT NULL,
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  LastLogin DATETIME2 NULL,
  IsActive BIT DEFAULT 1,
  IsVerified BIT DEFAULT 0,
  VerificationToken NVARCHAR(255) NULL,
  ResetPasswordToken NVARCHAR(255) NULL,
  ResetPasswordExpiry DATETIME2 NULL
);
CREATE INDEX idx_email ON [dbo].[Users](Email);
END
GO

-- -----------------------------------------------------
-- Table structure for Cultures
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cultures]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Cultures] (
  CultureID NVARCHAR(36) PRIMARY KEY,
  CultureName NVARCHAR(100) NOT NULL,
  Region NVARCHAR(100) NOT NULL,
  PrimaryLanguage NVARCHAR(100) NOT NULL,
  Description NVARCHAR(MAX) NOT NULL,
  LastUpdated DATETIME2 DEFAULT GETDATE()
);
CREATE INDEX idx_culture_name ON [dbo].[Cultures](CultureName);
CREATE INDEX idx_region ON [dbo].[Cultures](Region);
END
GO

-- -----------------------------------------------------
-- Table structure for CulturalNorms
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CulturalNorms]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[CulturalNorms] (
  NormID NVARCHAR(36) PRIMARY KEY,
  CultureID NVARCHAR(36) NOT NULL,
  Category NVARCHAR(50) NOT NULL,
  SubCategory NVARCHAR(100) NULL,
  Description NVARCHAR(MAX) NOT NULL,
  DoBehavior NVARCHAR(MAX) NOT NULL,
  DontBehavior NVARCHAR(MAX) NOT NULL,
  Explanation NVARCHAR(MAX) NOT NULL,
  SeverityLevel NVARCHAR(20) NOT NULL,
  LastUpdated DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_CulturalNorms_Cultures FOREIGN KEY (CultureID) REFERENCES [dbo].[Cultures](CultureID) ON DELETE CASCADE
);
CREATE INDEX idx_culture_category ON [dbo].[CulturalNorms](CultureID, Category);
END
GO

-- -----------------------------------------------------
-- Table structure for Idioms
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Idioms]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Idioms] (
  IdiomID NVARCHAR(36) PRIMARY KEY,
  CultureID NVARCHAR(36) NOT NULL,
  Language NVARCHAR(100) NOT NULL,
  Phrase NVARCHAR(MAX) NOT NULL,
  LiteralTranslation NVARCHAR(MAX) NOT NULL,
  Meaning NVARCHAR(MAX) NOT NULL,
  ContextNotes NVARCHAR(MAX) NULL,
  PolitenessLevel NVARCHAR(20) NOT NULL,
  LastUpdated DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_Idioms_Cultures FOREIGN KEY (CultureID) REFERENCES [dbo].[Cultures](CultureID) ON DELETE CASCADE
);
CREATE INDEX idx_culture_idiom ON [dbo].[Idioms](CultureID);
END
GO

-- -----------------------------------------------------
-- Table structure for IdiomUsageExamples
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[IdiomUsageExamples]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[IdiomUsageExamples] (
  ExampleID NVARCHAR(36) PRIMARY KEY,
  IdiomID NVARCHAR(36) NOT NULL,
  ExampleText NVARCHAR(MAX) NOT NULL,
  CONSTRAINT FK_IdiomUsageExamples_Idioms FOREIGN KEY (IdiomID) REFERENCES [dbo].[Idioms](IdiomID) ON DELETE CASCADE
);
END
GO

-- -----------------------------------------------------
-- Table structure for Scenarios
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Scenarios]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Scenarios] (
  ScenarioID NVARCHAR(36) PRIMARY KEY,
  CultureID NVARCHAR(36) NOT NULL,
  Category NVARCHAR(100) NOT NULL,
  Title NVARCHAR(255) NOT NULL,
  SituationDescription NVARCHAR(MAX) NOT NULL,
  ImageURL NVARCHAR(255) NULL,
  LastUpdated DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_Scenarios_Cultures FOREIGN KEY (CultureID) REFERENCES [dbo].[Cultures](CultureID) ON DELETE CASCADE
);
CREATE INDEX idx_scenarios_culture_category ON [dbo].[Scenarios](CultureID, Category);
END
GO

-- -----------------------------------------------------
-- Table structure for ScenarioChoices
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ScenarioChoices]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ScenarioChoices] (
  ChoiceID NVARCHAR(36) PRIMARY KEY,
  ScenarioID NVARCHAR(36) NOT NULL,
  ChoiceText NVARCHAR(MAX) NOT NULL,
  IsCorrectChoice BIT NOT NULL DEFAULT 0,
  FeedbackText NVARCHAR(MAX) NOT NULL,
  ConsequenceDescription NVARCHAR(MAX) NOT NULL,
  CONSTRAINT FK_ScenarioChoices_Scenarios FOREIGN KEY (ScenarioID) REFERENCES [dbo].[Scenarios](ScenarioID) ON DELETE CASCADE
);
END
GO

-- -----------------------------------------------------
-- Table structure for UserPreferences
-- -----------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserPreferences]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[UserPreferences] (
  PreferenceID NVARCHAR(36) PRIMARY KEY,
  UserID NVARCHAR(36) NOT NULL,
  CultureID NVARCHAR(36) NOT NULL,
  NormID NVARCHAR(36) NULL,
  ReminderEnabled BIT NOT NULL DEFAULT 1,
  CONSTRAINT FK_UserPreferences_Users FOREIGN KEY (UserID) REFERENCES [dbo].[Users](UserID) ON DELETE CASCADE,
  CONSTRAINT FK_UserPreferences_Cultures FOREIGN KEY (CultureID) REFERENCES [dbo].[Cultures](CultureID) ON DELETE NO ACTION,
  CONSTRAINT FK_UserPreferences_CulturalNorms FOREIGN KEY (NormID) REFERENCES [dbo].[CulturalNorms](NormID) ON DELETE SET NULL,
  CONSTRAINT UQ_UserPreferences_UserCultureNorm UNIQUE (UserID, CultureID, NormID)
);
END
GO

-- -----------------------------------------------------
-- Sample data population for demonstration
-- -----------------------------------------------------

-- Sample Cultures
IF NOT EXISTS (SELECT * FROM [dbo].[Cultures] WHERE CultureID = 'jp-001')
BEGIN
    INSERT INTO [dbo].[Cultures] (CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated) 
    VALUES ('jp-001', 'Japanese', 'East Asia', 'Japanese', 'Japan has a rich cultural heritage spanning thousands of years, with strong emphasis on politeness, social harmony, and respect for tradition.', '2023-05-01');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Cultures] WHERE CultureID = 'ar-001')
BEGIN
    INSERT INTO [dbo].[Cultures] (CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated) 
    VALUES ('ar-001', 'Arabic (Gulf)', 'Middle East', 'Arabic', 'Gulf Arabic cultures value hospitality, respect, family bonds, and religious traditions, with distinct customs around greetings and social interactions.', '2023-05-02');
END

IF NOT EXISTS (SELECT * FROM [dbo].[Cultures] WHERE CultureID = 'br-001')
BEGIN
    INSERT INTO [dbo].[Cultures] (CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated) 
    VALUES ('br-001', 'Brazilian', 'South America', 'Portuguese', 'Brazilian culture is known for its warmth, diversity, and rich expressions in music, cuisine, and social gatherings, with relaxed yet specific social norms.', '2023-05-03');
END
GO

-- Sample Cultural Norms for Japanese culture
IF NOT EXISTS (SELECT * FROM [dbo].[CulturalNorms] WHERE NormID = 'jp-norm-001')
BEGIN
    INSERT INTO [dbo].[CulturalNorms] (NormID, CultureID, Category, SubCategory, Description, DoBehavior, DontBehavior, Explanation, SeverityLevel, LastUpdated) 
    VALUES ('jp-norm-001', 'jp-001', 'Greeting', 'Bowing', 'Bowing etiquette in Japan', 'Bow when greeting someone, with the depth of bow reflecting the level of respect.', 'Don''t offer a handshake first, and don''t bow with hands in pockets or while chewing gum.', 'Bowing is an essential part of Japanese culture, showing respect and social status. The deeper and longer the bow, the more respect is shown.', 'High', '2023-05-01');
END
GO

-- Add more sample data as needed following the same pattern...

-- Sample user for testing
IF NOT EXISTS (SELECT * FROM [dbo].[Users] WHERE UserID = 'user-123456789')
BEGIN
    INSERT INTO [dbo].[Users] (UserID, Email, HashedPassword, CreatedAt, IsActive, IsVerified) 
    VALUES ('user-123456789', 'demo@example.com', '$2a$10$jZFb.EZ.lnVN8AfNxaVE/u.1QU5w26RtIRKS815lDHoELZCRh7qEe', '2023-05-01', 1, 1);
END
GO