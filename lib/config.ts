/**
 * Application Configuration
 * 
 * This file contains all configurable settings for your FIRST TeamMatch instance.
 * Update these values to customize the app for your state/region.
 */

export interface AppConfig {
    // State/Region Information
    stateName: string;
    stateAbbreviation: string;
    regionName: string; // e.g., "Oregon", "California", "Pacific Northwest"

    // Organization Information
    organizationName: string; // e.g., "FTC12808 RevAmped"
    organizationLocation: string; // e.g., "Portland, Oregon"
    organizationWebsite: string; // e.g., "https://revampedrobotics.org"
    organizationEmail: string; // e.g., "revampedrobotics@gmail.com"

    // Contact Information
    contactEmail: string; // Email for bug reports and general inquiries
    supportEmail?: string; // Optional separate support email

    // App Branding
    appName: string; // e.g., "FIRST TeamMatch Oregon"
    appDescription: string;

    // Deployment Information
    deploymentUrl?: string; // Optional: Your deployment URL for absolute links
}

/**
 * Get application configuration from environment variables
 * Falls back to sensible defaults if not set
 */
export function getAppConfig(): AppConfig {
    return {
        stateName: process.env.NEXT_PUBLIC_STATE_NAME || 'Oregon',
        stateAbbreviation: process.env.NEXT_PUBLIC_STATE_ABBREVIATION || 'OR',
        regionName: process.env.NEXT_PUBLIC_REGION_NAME || process.env.NEXT_PUBLIC_STATE_NAME || 'Oregon',

        organizationName: process.env.NEXT_PUBLIC_ORG_NAME || 'FTC12808 RevAmped',
        organizationLocation: process.env.NEXT_PUBLIC_ORG_LOCATION || 'Portland, Oregon',
        organizationWebsite: process.env.NEXT_PUBLIC_ORG_WEBSITE || 'https://revampedrobotics.org',
        organizationEmail: process.env.NEXT_PUBLIC_ORG_EMAIL || 'revampedrobotics@gmail.com',

        contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.NEXT_PUBLIC_ORG_EMAIL || 'revampedrobotics@gmail.com',
        supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,

        appName: process.env.NEXT_PUBLIC_APP_NAME || `FIRST TeamMatch ${process.env.NEXT_PUBLIC_STATE_NAME || 'Oregon'}`,
        appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
            `Connecting passionate students with competitive FIRST robotics teams in ${process.env.NEXT_PUBLIC_STATE_NAME || 'Oregon'}.`,

        deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    };
}

// Export a singleton instance for use throughout the app
export const appConfig = getAppConfig();

