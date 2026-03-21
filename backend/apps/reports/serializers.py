from __future__ import annotations

from rest_framework import serializers


class CompanyOverviewSerializer(serializers.Serializer):
  total_properties = serializers.IntegerField()
  active_properties = serializers.IntegerField()
  total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
  total_expenses = serializers.DecimalField(max_digits=14, decimal_places=2)
  net_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
  active_travel_agents = serializers.IntegerField()
  total_employees = serializers.IntegerField()
  present_today = serializers.IntegerField()
  on_leave_today = serializers.IntegerField()
  open_quotations = serializers.IntegerField()
  closed_quotations = serializers.IntegerField()
  sales_closings_this_month = serializers.IntegerField()
  upcoming_plan_expiry = serializers.IntegerField()


class FinanceSummarySerializer(serializers.Serializer):
  total_closing_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
  total_collected_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
  total_pending_amount = serializers.DecimalField(max_digits=14, decimal_places=2)


class DashboardChartsSerializer(serializers.Serializer):
  revenue_chart_data = serializers.ListField(child=serializers.DictField())
  property_distribution_data = serializers.ListField(child=serializers.DictField())
  closing_vs_pending_data = serializers.ListField(child=serializers.DictField())
  sales_performance_data = serializers.ListField(child=serializers.DictField())


class FinanceChartsSerializer(serializers.Serializer):
  monthly_revenue_data = serializers.ListField(child=serializers.DictField())
  expense_distribution_data = serializers.ListField(child=serializers.DictField())


class ExecutiveSerializer(serializers.Serializer):
  id = serializers.IntegerField()
  name = serializers.CharField()
  email = serializers.CharField()
  avatar = serializers.CharField()
  role = serializers.CharField()
  closings = serializers.IntegerField()
  revenue_generated = serializers.DecimalField(max_digits=14, decimal_places=2)
  demos_given = serializers.IntegerField()
  trials_provided = serializers.IntegerField()
  target_closings = serializers.IntegerField()
  monthly_performance = serializers.ListField(child=serializers.DictField(), allow_empty=True)
  agenda = serializers.ListField(child=serializers.DictField(), allow_empty=True)

