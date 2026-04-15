export default function getOpportunityState(opportunity) {
  return opportunity.nome?.match(/-\s*([A-Z]{2})$/)?.[1] || null;
}
